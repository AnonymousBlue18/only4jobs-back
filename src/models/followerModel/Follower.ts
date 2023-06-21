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

class Follower extends Model<
    InferAttributes<Follower>,
    InferCreationAttributes<Follower>
> {
    declare id: CreationOptional<number>
    declare followerId: ForeignKey<User["id"]>
    declare followingId: ForeignKey<User["id"]>
}

Follower.init(
    {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
    },
    {
        sequelize: sequelize,
        paranoid: true,
        tableName: "Follower",
    }
)

User.hasMany(Follower, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    foreignKey: {
        name: "followerId",
        allowNull: false,
    },
})
Follower.belongsTo(User, {
    foreignKey: {
        name: "followerId",
        allowNull: false,
    },
})
User.hasMany(Follower, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    foreignKey: {
        name: "followingId",
        allowNull: false,
    },
})

Follower.belongsTo(User, {
    foreignKey: {
        name: "followingId",
        allowNull: false,
    },
})

export default Follower
