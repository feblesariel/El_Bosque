module.exports = (sequelize, DataTypes) => {
    let alias = 'Product_image';
    let cols = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        url: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    };
    let config = {
        tableName: "product_images",
        timestamps: false,
        indexes: [
            {
                name: 'product_id_index',
                fields: ['product_id']
            },
            {
                name: 'url_index',
                fields: ['url']
            }
        ]
    }

    const Product_image = sequelize.define(alias, cols, config); 

    Product_image.associate = function (models) {

        Product_image.belongsTo(models.Product, { 
            as: 'Product',
            foreignKey: 'product_id',
            onDelete: 'CASCADE'
        });

    }

    return Product_image;
};