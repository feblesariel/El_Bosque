module.exports = (sequelize, DataTypes) => {
    let alias = 'Subscriber';
    let cols = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    };
    let config = {
        tableName: "subscribers",
        timestamps: false
    };

    const Subscriber = sequelize.define(alias, cols, config);

    return Subscriber;
};
