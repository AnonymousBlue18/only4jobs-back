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

class Job extends Model<InferAttributes<Job>, InferCreationAttributes<Job>> {
    declare id: CreationOptional<number>
    declare titleJob: string
    declare timeJob: string
    declare category: string
    declare workplace: string
    declare typeJob: string
    declare publishDate: Date
    declare salary: number
    declare description: string
    declare status: CreationOptional<string>
    declare userId: ForeignKey<User["id"]>
}

Job.init(
    {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        titleJob: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        timeJob: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        category: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        workplace: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        typeJob: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        publishDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        salary: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(500),
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: "active",
        },
    },
    {
        sequelize: sequelize,
        paranoid: true,
        tableName: "Job",
    }
)
Job.belongsTo(User, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    foreignKey: {
        name: "userId",
        allowNull: false,
    },
})

export default Job
