module.exports = (sequelize, DataTypes) => {
    let alias = 'Discount';
    let cols = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        code: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        discount_percentage: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    };
    let config = {
        tableName: "discounts",
        timestamps: false
    }

    const Discount = sequelize.define(alias, cols, config); 

    return Discount;
};