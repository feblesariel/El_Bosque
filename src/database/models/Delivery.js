module.exports = (sequelize, DataTypes) => {
    let alias = 'Delivery';
    let cols = {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(30),
            allowNull: false
        }
    };
    let config = {
        tableName: "delivery",
        timestamps: false
    }

    const Delivery = sequelize.define(alias, cols, config);

    
    return Delivery;
};