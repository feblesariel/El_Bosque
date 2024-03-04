module.exports = (sequelize, DataTypes) => {
    let alias = 'Category';
    let cols = {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        }
    };
    let config = {
        tableName: "categories",
        timestamps: false
    }

    const Category = sequelize.define(alias, cols, config);

    Category.associate = function (models) {

        Category.hasMany(models.Product, {
            as: 'Products',
            foreignKey: 'category_id',
            onDelete: 'CASCADE'
        });

    }

    
    return Category;
};