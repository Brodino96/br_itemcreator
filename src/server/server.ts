import type { ItemType } from "../types"

class Main {
    constructor() {
        onNet("br_itemcreator:createItem", (item: ItemType) => {
            this.createItem(item, source)
        })

        RegisterCommand("createitem", (id: number) => {
            if (!this.isAllowed(id)) { return }
            emitNet("br_itemcreator:showUi", id)
        }, false)
        
        exports("itemUsed", (event: string, item: object, inventory: number|string, slot: number, data: object) => {
            this.itemUsed(event, item, inventory, slot, data)
        })
    }

    private isAllowed(id: number): boolean {
        return true
    }

    private itemUsed(event: string, item: object, inventory: number|string, slot: number, data: object) {
        console.log("event", event)
        console.log("item", item)
        console.log("inventory", inventory)
        console.log("slot", slot)
        console.log("data", data)
        // TODO
    }

    private async createItem(item: ItemType, id: number) {
        const data = LoadResourceFile("ox_inventory", "/data/items.lua")
        const insertPos = data.lastIndexOf("}")
        if (insertPos === -1) {
            return
        }

        const newItem = `\t["${item.name}"] = {\n` +
            `\t\tlabel = "${item.label}",\n` +
            `\t\tclient = {\n` +
                `\t\t\timage = "${item.imageUrl}"\n` +
            `\t\t},\n` +
            `\t\tdescription = "${item.description}",\n` +
            `\t\tweight = ${item.weight},\n` +
            `\t\tdegrade = ${item.degrade},\n` +
            `\t\tdecay = ${item.decay}\n` +
        `\t},\n`;

        const updatedItems = data.slice(0, insertPos) + newItem + data.slice(insertPos)

        SaveResourceFile("ox_inventory", "/data/items.lua", updatedItems, -1)

        exports["ox_inventory"].AddItem(id, "br_itemcreator", 1, {
            label: item.label,
            weight: item.weight,
            description: item.description,
            imageurl: item.imageUrl,
        })
    }
}

new Main()