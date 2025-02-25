# br_itemcreator

To make sure the script works you **MUST** add this custom item into your `ox_inventory/data/items.lua`
```lua
["br_itemcreator"] = {
    label = "br_itemcreator",
    client = { event = "br_itemcreator:itemUsed"},
    consume = 0,
},
```