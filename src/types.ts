export type ConfigType = {
    debugMode: boolean,
    locale: string
}

export type ItemType = {
    name: string,
    label: string,
    imageUrl: string,
    description: string,
    weight: number,
}

export type ItemType2 = {
    name: string,
    metadata: {
        label: string,
        imageurl: string,
        description: string,
        weight: number,
    },
}