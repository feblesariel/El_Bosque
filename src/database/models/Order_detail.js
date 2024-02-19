module.exports = (sequelize, DataTypes) => {
    let alias = 'Order_detail';
    let cols = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        order_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        dni: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        address: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        city: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        postal_code: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        note: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    };
    let config = {
        tableName: "order_details",
        timestamps: false
    };

    const Order_detail = sequelize.define(alias, cols, config);

    Order_detail.associate = function(models) {

        Order_detail.belongsTo(models.Order, {
            as: 'Order',
            foreignKey: 'order_id',
            onDelete: 'CASCADE'
        });
    };

    return Order_detail;
};