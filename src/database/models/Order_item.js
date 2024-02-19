module.exports = (sequelize, DataTypes) => {
    let alias = 'Order_item';
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
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        product_options: {
            type: DataTypes.JSON,
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        subtotal_amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        }
    };
    let config = {
        tableName: "order_items",
        timestamps: false
    };

    const Order_item = sequelize.define(alias, cols, config);

    Order_item.associate = function(models) {

        Order_item.belongsTo(models.Order, {
            as: 'Order',
            foreignKey: 'order_id',
            onDelete: 'CASCADE'
        });
        Order_item.belongsTo(models.Product, {
            as: 'Product',
            foreignKey: 'product_id'
        });
    };

    return Order_item;
};