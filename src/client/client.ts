import { inputDialog } from "@overextended/ox_lib/client"
import { locale } from "../shared/locales"
import type { ItemType } from "../types"

class Main {

    constructor() {
        onNet("br_itemcreator:showUi", () => {
            this.showUi()
        })

        on("br_itemcreator:itemUsed", (event: string, item: ItemType) => {
            emitNet("br_itemcreator:itemUsed", item)
        })
    }

    private async showUi() {
        const item = await this.input()
        if (!item) { return }
        emitNet("br_itemcreator:createItem", item)
    }

    public async input() {
        
        const options = await inputDialog(locale("input_title"), [
            { type: "input", label: locale("item_id"), required: true }, // id
            { type: "input", label: locale("item_label"), required: true }, // Label
            { type: "input", label: locale("item_image"), required: true }, // Url
            { type: "input", label: locale("item_description"), required: false }, // Description
            { type: "number", label: locale("item_weight"), default: 0, required: true }, // Weight
        ], { allowCancel: true })
        
        if (!options) { return }

        return {
            name: options[0],
            label: options[1],
            imageUrl: options[2],
            description: options[3],
            weight: options[4],
            degrade: options[5],
            decay: options[6]
        }
    }
}

new Main