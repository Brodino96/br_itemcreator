import type { ItemType, ItemType2 } from "../types"
import { Config } from "../shared/config"
import { Server as ESXServer } from "esx.js"
import Logger from "../shared/logger"

class Main {

    private ESX: ESXServer | undefined
    private logger = new Logger

    constructor() {
        onNet("br_itemcreator:createItem", (item: ItemType) => {
            this.logger.info("Creating an item")
            this.createItem(item, source)
        })

        RegisterCommand("createitem", (id: number) => {
            if (!this.isAllowed(id)) { return }
            this.logger.info(`Opening menu for player [${id}]`)
            emitNet("br_itemcreator:showUi", id)
        }, false)
        
        onNet("br_itemcreator:itemUsed", (item: ItemType2) => {
            this.logger.info(`Fake item [${item.metadata.label}] has been used`)
            this.itemUsed(source, item)
        })

        if (Config.permissions.type === "esx") {
            this.ESX = exports["es_extended"].getSharedObject()
            this.logger.info("ESX Framework loaded")
        }
    }

    private isAllowed(id: number): boolean {
        if (Config.permissions.type === "esx") {
            return this.ESX?.GetPlayerFromId(id).getGroup() === Config.permissions.value
        } else if (Config.permissions.type === "ace") {
            return IsPlayerAceAllowed(id.toString(), Config.permissions.value)
        }
        this.logger.error("No valid permission type was specified in the config, defaulting check to [false]", true)
        return false
    }

    private itemUsed(id: number, item: ItemType2) {
        if (!this.isAllowed(id)) { return }
        exports["ox_inventory"].AddItem(id, item.name, 1, {
            label: item.metadata.label,
            weight: item.metadata.weight,
            description: item.metadata.description,
            imageurl: item.metadata.imageurl,
        })
        this.logger.info(`Duplicating item: [${item.metadata.label}] for player [${id}]`)
    }

    private async createItem(item: ItemType, id: number) {
        this.logger.info("Reading item list")
        const data = LoadResourceFile("ox_inventory", "/data/items.lua")
        const insertPos = data.lastIndexOf("}")
        if (insertPos === -1) {
            return this.logger.error("Sum error occurred")
        }

        const newItem = `\t["${item.name}"] = {\n` +
            `\t\tlabel = "${item.label}",\n` +
            `\t\tclient = {\n` +
                `\t\t\timage = "${item.imageUrl}"\n` +
            `\t\t},\n` +
            `\t\tdescription = "${item.description}",\n` +
            `\t\tweight = ${item.weight},\n` +
        `\t},\n`;
        this.logger.info(`New item is: ${newItem}`)

        const updatedItems = data.slice(0, insertPos) + newItem + data.slice(insertPos)

        SaveResourceFile("ox_inventory", "/data/items.lua", updatedItems, -1)
        this.logger.info("Saving item list")

        exports["ox_inventory"].AddItem(id, "br_itemcreator", 2, {
            label: item.label,
            weight: item.weight,
            description: item.description,
            imageurl: item.imageUrl,
        })
        this.logger.info(`Gave 2 items to player: [${id}]`)
    }
}

new Main()