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
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        method: {
            type: DataTypes.ENUM('Retiro', 'Envio'),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('Procesando', 'Preparando', 'Listo', 'Completado', 'Cancelado'),
            allowNull: false
        },
        scheduled_date: {
            type: DataTypes.TEXT,
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