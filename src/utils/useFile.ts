import config from "../config"

export const parseFile = (name: string): string =>
    `${config.DOMAIN}/src/assets/${name}`
