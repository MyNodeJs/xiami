/**
 * ArtistController
 *
 * @module      :: Controller
 * @description    :: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var tool = require("../services/tool");
var service = require("../services/request");
module.exports = {

    find: function (req, res) {
        var name = req.query.name;
//      console.log("name", name);
        service.getIndexHtml(name, function (info) {
//          console.log("info", info);
            var obj = {};
            if (info.code == 200) {
                service.getAccount(info.msg, function (account) {
//                  console.log("account", account);
                    req.session.user = {
                        uid: info.uid
                    };
                    obj.account = account;
                    service.getPopMusic(info.msg, function (popMusic) {
                        obj.popMusic = popMusic;
                        service.getComment(info.msg, info.uid, 1, function (comment) {
                            obj.comment = comment;
                            return res.json(obj);
                        });
                    });
                });
            } else {
                return res.send('您要找的是不是:' + info.msg);
            }
        });
    },

    getBasicInfo: function (req, res) {
        if (!req.session.user) {
            return res.send(500);
        }
        var uid = req.session.user.uid;
        service.getBasicInfo(uid, function (info) {
            res.json(info);
        });
    },

    getSimilarArtist: function (req, res) {
        if (!req.session.user) {
            return res.send(500);
        }
        var uid = req.session.user.uid;
        service.getSimilarArtist(uid, function (info) {
            res.json(info);
        });
    },

    getArtistPics: function (req, res) {
        if (!req.session.user) {
            return res.send(500);
        }
        var page = req.query.page || 1;
        var uid = req.session.user.uid;
        service.getPic(uid, page, function (pic) {
            res.json(pic);
        });
    },

    getAlbum: function (req, res) {
        if (!req.session.user) {
            return res.send(500);
        }
        var page = req.query.page || 1;
        var uid = req.session.user.uid;
        console.log("uid, page", uid, page);
        service.getAlbum(uid, page, function (alblm) {
            return res.json(alblm);
        });
    },

    getBigPic: function (req, res) {
        var id = req.query.id;
        service.getBigPic(id, function (img) {
            return res.json(img);
        });
    },
    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to ArtistController)
     */
    _config: {}


};