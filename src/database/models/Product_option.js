module.exports = (sequelize, DataTypes) => {
    let alias = 'Product_option';
    let cols = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_product: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        option_type: {
            type: DataTypes.ENUM('Tamaño', 'Relleno', 'Cobertura', 'Decoración'),
            allowNull: false
        },
        option_value: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
            allowNull: false
        }
    };
    let config = {
        tableName: "product_options",
        timestamps: false
    }

    const Product_option = sequelize.define(alias, cols, config); 

    Product_option.associate = function (models) {

        Product_option.belongsTo(models.Product, { 
            as: 'Product',
            foreignKey: 'id_product',
            onDelete: 'CASCADE'
        });

    }

    return Product_option;
};