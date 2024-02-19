module.exports = (sequelize, DataTypes) => {
    let alias = 'Payment';
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
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('Pendiente', 'Completado', 'Cancelado'),
            allowNull: false
        },
        payment_method: {
            type: DataTypes.ENUM('transfer', 'mercado_pago'),
            allowNull: false
        },
        transaction_id: {
            type: DataTypes.STRING(255),
            allowNull: true
        }
    };
    let config = {
        tableName: "payments",
        timestamps: true
    };

    const Payment = sequelize.define(alias, cols, config);

    Payment.associate = function(models) {

        Payment.belongsTo(models.Order, {
            as: 'Order',
            foreignKey: 'order_id',
            onDelete: 'CASCADE'
        });
    };

    return Payment;
};