module.exports = (sequelize, DataTypes) => {
    let alias = 'Product';
    let cols = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        sold_count: {
            type: DataTypes.INTEGER(5),
            allowNull: false,
            defaultValue: 0
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        available: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    };
    let config = {
        tableName: "products",
        timestamps: false
    }

    const Product = sequelize.define(alias, cols, config); 

    Product.associate = function (models) {

        Product.belongsTo(models.Category, { 
            as: 'Category',
            foreignKey: 'category_id',
            onDelete: 'CASCADE'
        });

        Product.hasMany(models.Product_image, {
            as: 'Product_image',
            foreignKey: 'product_id',
            onDelete: 'CASCADE'
        });

        Product.hasMany(models.Product_option, {
            as: 'Product_option',
            foreignKey: 'id_product',
            onDelete: 'CASCADE'
        });

    }

    return Product;
};