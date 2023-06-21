import {
    CreationOptional,
    DataTypes,
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize"
import { sequelize } from "../../database"
import Profile from "../profileModels/Profile"

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: CreationOptional<number>
    declare tag: string
    declare name: string
    declare lastname: string
    declare dateOfBirth: CreationOptional<Date>
    declare phone: CreationOptional<string>
    declare country: CreationOptional<string>
    declare studies: CreationOptional<string>
    declare laboralExperience: CreationOptional<string>
    declare email: string
    declare password: string
    declare image: CreationOptional<string>
    declare banner: CreationOptional<string>
    declare video: CreationOptional<string>
    declare profileId: ForeignKey<Profile["id"]>
}

User.init(
    {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        tag: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        lastname: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        dateOfBirth: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        country: {
            type: DataTypes.STRING(45),
            allowNull: true,
        },
        studies: {
            type: DataTypes.STRING(1000),
            allowNull: true,
        },
        laboralExperience: {
            type: DataTypes.STRING(1000),
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
        banner: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
        video: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
    },
    {
        sequelize: sequelize,
        paranoid: true,
        tableName: "User",
    }
)

User.belongsTo(Profile, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    foreignKey: {
        name: "profileId",
        allowNull: false,
    },
})

export default User
