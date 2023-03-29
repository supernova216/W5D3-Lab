require('dotenv').config()
const {CONNECTION_STRING}=process.env
const Sequelize = require('sequelize')
const sequelize = new Sequelize(CONNECTION_STRING,{
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
})

let nextEmp = 5

module.exports = {
    getUpcomingAppointments: (req, res) => {
        sequelize.query(`select a.appt_id, a.date, a.service_type, a.approved, a.completed, u.first_name, u.last_name 
        from cc_appointments a
        join cc_emp_appts ea on a.appt_id = ea.appt_id
        join cc_employees e on e.emp_id = ea.emp_id
        join cc_users u on e.user_id = u.user_id
        where a.approved = true and a.completed = false
        order by a.date desc;`)
            .then(dbRes => res.status(200).send(dbRes[0]))
            .catch(err => console.log(err))
    },

    approveAppointment: (req, res) => {
        let {apptId} = req.body
    
        sequelize.query(`
        UPDATE cc_appointments AS a
        SET approved = true
        WHERE a.appt_id = ${apptId};
        
        insert into cc_emp_appts (emp_id, appt_id)
        values (${nextEmp}, ${apptId}),
        (${nextEmp + 1}, ${apptId});
        `)
            .then(dbRes => {
                res.status(200).send(dbRes[0])
                nextEmp += 2
            })
            .catch(err => console.log(err))
    },

    getAllClients: (req,res)=>{
        sequelize.query(`
        SELECT * FROM cc_users AS c
        JOIN cc_clients AS u
        ON c.user_id = u.user_id;
        `).then(dbRes => res.status(200).send(dbRes[0]))
        .catch(theseHands => console.log(theseHands))
    },

    getPendingAppointments: (req,res)=>{
        sequelize.query(`
        SELECT * FROM cc_appointments
        WHERE approved = false
        ORDER BY date DESC;
        `).then(dbRes => res.status(200).send(dbRes[0]))
        .catch(theseHands => console.log(theseHands))
    },

    getPastAppointments: (req,res)=>{
        sequelize.query(`
        SELECT a.appt_id, a.date, a.service_type, a.notes, c.first_name, c.last_name FROM cc_appointments AS a 
        JOIN cc_clients AS b ON a.client_id = b.client_id
        JOIN cc_users AS c ON b.user_id = c.user_id
        WHERE a.approved = true AND a.completed = true;
        `).then(dbRes => res.status(200).send(dbRes[0]))
        .catch(theseHands => console.log(theseHands))
    },

    completeAppointment:(req,res)=>{
        let {apptId} = req.body
        sequelize.query(`
        UPDATE cc_appointments AS a
        SET completed = true
        WHERE a.appt_id = ${apptId};
        `).then(dbRes => res.status(200).send(dbRes[0]))
        .catch(theseHands => console.log(theseHands))
    }
}
