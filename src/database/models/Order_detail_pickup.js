module.exports = (sequelize, DataTypes) => {
    let alias = 'Order_detail_pickup';
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
        tableName: "order_details_pickup",
        timestamps: false
    };

    const Order_detail_pickup = sequelize.define(alias, cols, config);

    Order_detail_pickup.associate = function(models) {

        Order_detail_pickup.belongsTo(models.Order, {
            as: 'Order',
            foreignKey: 'order_id',
            onDelete: 'CASCADE'
        });
    };

    return Order_detail_pickup;
};