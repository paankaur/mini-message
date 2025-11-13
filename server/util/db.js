import Sequelize from 'sequelize';

const sequelize = new Sequelize('messenger', 'root', 'qwerty',{
    dialect: 'mysql',
    host: 'localhost'
})

export default sequelize;