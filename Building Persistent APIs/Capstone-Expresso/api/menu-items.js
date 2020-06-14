const express = require('express');
const menuItemsRouter = express.Router({mergeParams: true});

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

menuItemsRouter.param('menuId', (req, res, next, menuId) => {
    db.get(`SELECT * FROM Menu WHERE Menu.id = ${menuId}`, (error, menu) => {
        if(error) next(error);
        else {
            if(!menu) return res.sendStatus(404);
            next();
        }
    });
});

menuItemsRouter.param('menuItemId', (req, res, next, menuItemId) => {
    db.get(`SELECT * FROM MenuItem WHERE id = ${menuItemId}`, (error, menuItem) => {
        if(error) next(error);
        else {
            if(!menuItem) return res.sendStatus(404);
            next();
        }
    })
})

menuItemsRouter.get('/', (req, res, next) => {
    db.all(`SELECT * FROM MenuItem WHERE MenuItem.menu_id = ${req.params.menuId}`, (error, menuItems) => {
        if(error) next(error);
        else {
            res.status(200).json({menuItems: menuItems});
        }
    });
});

menuItemsRouter.post('/', (req, res, next) => {
    let menuItemObject = req.body.menuItem;
    let name = menuItemObject.name, description = menuItemObject.description, inventory = menuItemObject.inventory, price = menuItemObject.price, menuId = req.params.menuId;
    if(!name || !description || !inventory || !price) {
        return res.sendStatus(400);
    }
    const sql = 'INSERT INTO MenuItem (name, description, inventory, price, menu_id) VALUES ($name, $description, $inventory, $price, $menuId)';
    const values = {
        $name: name,
        $description: description,
        $inventory: inventory,
        $price: price,
        $menuId: menuId
    };
    db.run(sql, values, function(error) {
        if(error) next(error);
        else {
            db.get(`SELECT * FROM MenuItem WHERE id = ${this.lastID}`, (error, newMenuItem) => {
                if(error) next(error);
                else {
                    res.status(201).json({menuItem: newMenuItem});
                }
            });
        }
    });
});

menuItemsRouter.put('/:menuItemId', (req, res, next) => {
    let menuItemObject = req.body.menuItem;
    let name = menuItemObject.name, description = menuItemObject.description, inventory = menuItemObject.inventory, price = menuItemObject.price, menuId = req.params.menuId, menuItemId = req.params.menuItemId;
    if(!name || !description || !inventory || !price) {
        return res.sendStatus(400);
    }
    const sql = 'UPDATE MenuItem SET name = $name, description = $description, inventory = $inventory, price = $price, menu_id = $menuId WHERE id = $menuItemId';
    const values = {
        $name: name,
        $description: description,
        $inventory: inventory,
        $price: price,
        $menuId: menuId,
        $menuItemId: menuItemId
    };
    db.run(sql, values, function(error) {
        if(error) next(error);
        else {
            db.get(`SELECT * FROM MenuItem WHERE id = ${menuItemId}`, (error, updatedMenuItem) => {
                if(error) next(error);
                else {
                    res.status(200).json({menuItem: updatedMenuItem});
                }
            });
        }
    });
});

menuItemsRouter.delete('/:menuItemId', (req, res, next) => {
    const sql = 'DELETE FROM MenuItem WHERE MenuItem.id = $menuItemId';
    db.run(sql, {$menuItemId: req.params.menuItemId}, function(error) {
        if(error) next(error);
        else {
            res.sendStatus(204);
        }
    })
})

module.exports = menuItemsRouter;