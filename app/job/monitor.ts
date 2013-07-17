
import db = module('../db/db')
import error = module('../api/error')
import model_dcase = module('../model/dcase')
import model_commit = module('../model/commit')
import model_node = module('../model/node')
import model_monitor = module('../model/monitor')
import net_rec = module('../net/rec')

//var db = require('../db/db')
//var model_dcase = require('../model/dcase')
//var model_monitor = require('../model/monitor')
var async = require('async')
var CONFIG = require('config')

var con = new db.Database();

con.begin((err, result) => {
	var monitor = new model_monitor.MonitorDAO(con);
	monitor.list((err:any, list:model_monitor.MonitorNode[]) => {
		var procCnt = 0;
		var skipCnt = 0;
		if (err) {
			console.log(err);
			process.exit(1);
		}
		if (list.length == 0) {
			console.log('no object data');
			process.exit(0);
		}

		async.forEachSeries(list, (it, cb) => {
			var dcase = new model_dcase.DCaseDAO(con);
		
			async.waterfall([
				(callback) => {
console.log('----------------');
console.log('monitor_node_id=' + it.id);
					dcase.get(it.dcaseId, (err, resultDCase:model_dcase.DCase) => {
						callback(err, resultDCase, false, null);
					});
				},
				(resultDCase:model_dcase.DCase, runFlag: bool, commitId, callback) => {
console.log(resultDCase.name);
					if (resultDCase.deleteFlag) {
						callback(null, resultDCase, true, null);
					} else {
						monitor.getLatestCommit(it.dcaseId, (err, resultCommit:model_commit.Commit) => {
							if (resultCommit) {
								callback(err, resultDCase, false, resultCommit.id); 
							} else {
								callback(err, resultDCase, true, null);
							}
						});
					}
				},
				(resultDCase:model_dcase.DCase, runFlag: bool, commitId, callback) => {
console.log('COMMITID=' + commitId);
					if (runFlag) {
						callback(null, resultDCase, true, commitId);				
					} else {
						var node = new model_node.NodeDAO(con);
						node.getNode(commitId, it.thisNodeId, (err, resultNode:model_node.Node) => {
							if (resultNode) {
								callback(err, resultDCase, false, commitId);
							} else {
								callback(null, resultDCase, true, commitId);
							}
						});
					}
				},
				(resultDCase:model_dcase.DCase, runFlag: bool, commitId, callback) => {
console.log('Result=' + runFlag);
					if (runFlag) {
						var rec = new net_rec.Rec();
						rec.request('deleteMonitor', {"nodeID ":it.id}, (err:any, resultMonitor:any) => {
							if (err) {
								callback(err, resultDCase, false, commitId);
							} else {
								if (!resultMonitor) {
									callback(null,  resultDCase, true, commitId);
								} else {
									callback(new error.InvalidRequestError(null, resultMonitor), resultDCase, false, commitId);
								}
							}
						});
					} else {
						callback(null, resultDCase, false, commitId);
					}
				},
				(resultDCase:model_dcase.DCase, runFlag: bool, commitId, callback) => {
					if (runFlag) {
						it.deleteFlag = true;
						monitor.update(it, (err:any) => {
							if (err) {
								callback(err);	
							} else {
								procCnt++;
								callback(null);
							}
						});
					} else {
						skipCnt++;
						callback(null);
					}
				}
			],(err:any) => {
				if (err) {
					console.log(err);
					con.close();
					process.exit(1);
				}
				cb();
			});
		},() => {
			console.log('SKIP:' + skipCnt);
			console.log('PROC:' + procCnt);
			process.exit(0);
		});
	});
});





