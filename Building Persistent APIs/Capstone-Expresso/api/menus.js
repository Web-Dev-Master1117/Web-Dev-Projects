const express = require('express');
const menusRouter = express.Router();

const menuItemsRouter = require('./menu-items');

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

menusRouter.param('menuId', (req, res, next, menuId) => {
    db.get(`SELECT * FROM Menu WHERE Menu.id = ${menuId}`, (error, menu) => {
        if(error) next(error);
        else {
            if(!menu) return res.sendStatus(404);
            req.menu = menu;
            next();
        }
    });
});

menusRouter.use('/:menuId/menu-items', menuItemsRouter);

menusRouter.get('/', (req, res, next) => {
    db.all(`SELECT * FROM Menu`, (error, menus) => {
        res.status(200).json({menus: menus});
    });
});

menusRouter.post('/', (req, res, next) => {
    let title = req.body.menu.title;
    if(!title) return res.sendStatus(400);
    db.run('INSERT INTO Menu (title) VALUES ($title)', {$title: title}, function(error) {
        if(error) next(error);
        else {
            db.get(`SELECT * FROM Menu WHERE Menu.id = ${this.lastID}`, (error, newMenu) => {
                if(error) next(error);
                else {
                    res.status(201).json({menu: newMenu});
                }
            });
        }
    });
});

menusRouter.get('/:menuId', (req, res, next) => {
    res.status(200).json({menu: req.menu});
});

menusRouter.put('/:menuId', (req, res, next) => {
    let title = req.body.menu.title;
    if(!title) return res.sendStatus(400);
    db.run('UPDATE Menu SET title = $title WHERE Menu.id = $menuId', {$title: title, $menuId: req.params.menuId}, function(error) {
        if(error) next(error);
        else {
            db.get(`SELECT * FROM Menu WHERE Menu.id = ${req.params.menuId}`, (error, updatedMenu) => {
                if(error) next(error);
                else {
                    res.status(200).json({menu: updatedMenu});
                }
            });
        }
    });
});

menusRouter.delete('/:menuId', (req, res, next) => {
    db.get(`SELECT * FROM MenuItem WHERE menu_id = ${req.params.menuId}`, function(error, menuItem) {
        if(error) next(error);
        else {
            if(menuItem)
                return res.sendStatus(400);
            let sql = 'DELETE FROM Menu WHERE id = $menuId';
            db.run(sql, {$menuId: req.params.menuId}, function(error) {
                if(error) next(error);
                else {
                    res.sendStatus(204);
                }
            });
        }
    });
});

module.exports = menusRouter;