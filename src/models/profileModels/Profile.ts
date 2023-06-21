import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize"

import { sequelize } from "../../database"
import { ProfileEnum } from "../../interfaces/utils/Profiles"

class Profile extends Model<
    InferAttributes<Profile>,
    InferCreationAttributes<Profile>
> {
    declare id: CreationOptional<number>
    declare name: string
    declare status: CreationOptional<boolean>
}

Profile.init(
    {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    },
    {
        sequelize: sequelize,
        paranoid: true,
        tableName: "Profile",
    }
)

export const createProfiles = () => {
    Object.entries(ProfileEnum).forEach(async element => {
        if (typeof element[1] === "number") {
            await Profile.findOrCreate({
                where: { id: element[1], name: element[0] },
            })
        }
    })
}

export default Profile
