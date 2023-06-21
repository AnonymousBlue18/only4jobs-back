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
import Job from "./Job"

class JobSubscription extends Model<
    InferAttributes<JobSubscription>,
    InferCreationAttributes<JobSubscription>
> {
    declare id: CreationOptional<number>
    declare susbscriptorId: ForeignKey<User["id"]>
    declare jobId: ForeignKey<Job["id"]>
    declare ownerId: ForeignKey<Job["userId"]>
    declare status: CreationOptional<string>
}

JobSubscription.init(
    {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
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
        tableName: "JobSubscription",
        indexes: [
            {
                unique: true,
                fields: ["susbscriptorId", "jobId"],
            },
        ],
    }
)

User.belongsToMany(Job, {
    through: "JobSubscription",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    foreignKey: {
        name: "susbscriptorId",
        allowNull: false,
    },
})
Job.belongsToMany(User, {
    through: "JobSubscription",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    foreignKey: {
        name: "jobId",
        allowNull: false,
    },
})

JobSubscription.belongsTo(User, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    foreignKey: {
        name: "ownerId",
        allowNull: false,
    },
})

JobSubscription.belongsTo(Job, {
    foreignKey: "jobId",
})

export default JobSubscription
