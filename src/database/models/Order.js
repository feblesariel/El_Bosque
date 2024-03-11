module.exports = (sequelize, DataTypes) => {
    let alias = 'Order';
    let cols = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        discount_id: {
            type: DataTypes.INTEGER
        },
        code: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        method: {
            type: DataTypes.ENUM('pickup', 'delivery'),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('procesando', 'preparando', 'listo', 'completado', 'cancelado'),
            allowNull: false
        }
    };
    let config = {
        tableName: "orders",
        timestamps: true
    };

    const Order = sequelize.define(alias, cols, config);

    Order.associate = function(models) {

        Order.belongsTo(models.Discount, {
            as: 'Discount',
            foreignKey: 'discount_id'
        });
    };

    return Order;
};