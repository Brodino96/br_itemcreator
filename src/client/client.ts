import { inputDialog } from "@overextended/ox_lib/client"
import { locale } from "../shared/locales"

class Main {

    constructor() {
        onNet("br_itemcreator:showUi", () => {
            this.showUi()
        })
    }

    private async showUi() {
        const item = await this.input()
        if (!item) { return }
        emitNet("br_itemcreator:createItem", item)
    }

    public async input() {
        
        const options = await inputDialog(locale("input_title"), [
            { type: "input", label: locale("item_id"), required: true }, //
            { type: "input", label: locale("item_label"), required: true }, //
            { type: "input", label: locale("item_image"), required: true }, //
            { type: "input", label: locale("item_description"), required: false }, //
            { type: "number", label: locale("item_weight"), default: 0, required: true }, //
            { type: "number", label: locale("item_degrade"), required: false }, //
            { type: "checkbox", label: locale("item_decay"), checked: false }, //
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