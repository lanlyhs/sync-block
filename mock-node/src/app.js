const express = require("express");
const app = express();
const tableNames = require("./constants/tableNames");
const knex = require("./db/config");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/version", async (req, res) => {
    const [{ max_height }] = await knex(tableNames.block).max({
        max_height: "height",
    });
    res.json({
        version: 2,
        start_height: max_height,
    });
});

app.get("/blockheader/:height", async (req, res) => {
    const [block] = await knex(tableNames.block).where({
        height: req.params.height,
    });
    res.json({
        block,
    });
});

app.get("/blockevents/:height", async (req, res) => {
    const eventHashs = await knex(tableNames.event)
        .where({
            height: req.params.height,
        })
        .select("hash");
    res.json({
        eventHashs,
    });
});

app.get("/blockevent/:hash", async (req, res) => {
    const [event] = await knex(tableNames.event).where({
        hash: req.params.hash,
    });
    res.json({
        event,
    });
});

module.exports = app;
