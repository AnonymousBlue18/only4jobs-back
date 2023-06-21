import {
    CreationOptional,
    DataTypes,
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize"

import { sequelize } from "../../database"
import User from "../userModels/User"
import Bet from "./Bet"

class BetSubscription extends Model<
    InferAttributes<BetSubscription>,
    InferCreationAttributes<BetSubscription>
> {
    declare id: CreationOptional<number>
    declare susbscriptorId: ForeignKey<User["id"]>
    declare betId: ForeignKey<Bet["id"]>
    declare ownerId: ForeignKey<Bet["userId"]>
    declare title: string
    declare vote: boolean
    declare status: CreationOptional<string>
}

BetSubscription.init(
    {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        vote: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: "payed",
        },
    },
    {
        sequelize: sequelize,
        paranoid: true,
        tableName: "BetSubscription",
        indexes: [
            {
                unique: true,
                fields: ["susbscriptorId", "betId"],
            },
        ],
    }
)

User.belongsToMany(Bet, {
    through: "BetSubscription",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    foreignKey: {
        name: "susbscriptorId",
        allowNull: false,
    },
})

Bet.belongsToMany(User, {
    through: "BetSubscription",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    foreignKey: {
        name: "betId",
        allowNull: false,
    },
})
BetSubscription.belongsTo(User, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    foreignKey: {
        name: "ownerId",
        allowNull: false,
    },
})

BetSubscription.belongsTo(Bet, {
    foreignKey: "betId",
})

export default BetSubscription
