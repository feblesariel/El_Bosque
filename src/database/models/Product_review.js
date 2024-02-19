module.exports = (sequelize, DataTypes) => {
    let alias = 'Product_review';
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
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    };
    let config = {
        tableName: "product_reviews",
        timestamps: false
    };

    const Product_review = sequelize.define(alias, cols, config);

    Product_review.associate = function(models) {

        Product_review.belongsTo(models.Product, {
            as: 'Product',
            foreignKey: 'product_id',
            onDelete: 'CASCADE'
        });
    };

    return Product_review;
};