module.exports = (sequelize, DataTypes) => {
    let alias = 'Order_detail_delivery';
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
        scheduled_date: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(255),
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
        tableName: "order_details_delivery",
        timestamps: false
    };

    const Order_detail_delivery = sequelize.define(alias, cols, config);

    Order_detail_delivery.associate = function(models) {

        Order_detail_delivery.belongsTo(models.Order, {
            as: 'Order',
            foreignKey: 'order_id',
            onDelete: 'CASCADE'
        });
    };

    return Order_detail_delivery;
};