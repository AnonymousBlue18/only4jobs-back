import {
    CreationOptional,
    DataTypes,
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize"

import { sequelize } from "../../database"
import Bet from "../betModels/Bet"
import User from "../userModels/User"

class Pay extends Model<InferAttributes<Pay>, InferCreationAttributes<Pay>> {
    declare id: CreationOptional<number>
    declare date: Date
    declare title: string
    declare payed: CreationOptional<boolean>
    declare status: CreationOptional<boolean>
    declare betId: ForeignKey<Bet["id"]>
    declare winnerId: ForeignKey<User["id"]>
}

Pay.init(
    {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },

        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },

        title: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },

        payed: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
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
        tableName: "Pay",
    }
)

Pay.belongsTo(Bet, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    foreignKey: {
        name: "betId",
        allowNull: false,
    },
})
Pay.belongsTo(User, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    foreignKey: {
        name: "winnerId",
        allowNull: false,
    },
})
export default Pay
