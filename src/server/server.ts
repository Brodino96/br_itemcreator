import type { ItemType, ItemType2 } from "../types"

class Main {
    constructor() {
        onNet("br_itemcreator:createItem", (item: ItemType) => {
            this.createItem(item, source)
        })

        RegisterCommand("createitem", (id: number) => {
            if (!this.isAllowed(id)) { return }
            emitNet("br_itemcreator:showUi", id)
        }, false)
        
        onNet("br_itemcreator:itemUsed", (item: ItemType2) => {
            this.itemUsed(source, item)
        })
    }

    private isAllowed(id: number): boolean {
        return true
    }

    private itemUsed(id: number, item: ItemType2) {
        if (!this.isAllowed(id)) { return }
        exports["ox_inventory"].AddItem(id, item.name, 1, {
            label: item.metadata.label,
            weight: item.metadata.weight,
            description: item.metadata.description,
            imageurl: item.metadata.imageurl,
        })
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
        `\t},\n`;

        const updatedItems = data.slice(0, insertPos) + newItem + data.slice(insertPos)

        SaveResourceFile("ox_inventory", "/data/items.lua", updatedItems, -1)

        exports["ox_inventory"].AddItem(id, "br_itemcreator", 2, {
            label: item.label,
            weight: item.weight,
            description: item.description,
            imageurl: item.imageUrl,
        })
    }
}

new Main()