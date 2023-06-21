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

class Bet extends Model<InferAttributes<Bet>, InferCreationAttributes<Bet>> {
    declare id: CreationOptional<number>
    declare title: string
    declare category: string
    declare description: string
    declare endDate: Date
    declare price: number
    declare question: string
    declare prediction: boolean
    declare answer: CreationOptional<boolean>
    declare status: CreationOptional<string>
    declare userId: ForeignKey<User["id"]>
}

Bet.init(
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
        category: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(500),
            allowNull: false,
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },

        question: {
            type: DataTypes.STRING(500),
            allowNull: false,
        },
        prediction: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        answer: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        status: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: "review",
        },
    },
    {
        sequelize: sequelize,
        paranoid: true,
        tableName: "Bet",
    }
)

Bet.belongsTo(User, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    foreignKey: {
        name: "userId",
        allowNull: false,
    },
})

export default Bet
