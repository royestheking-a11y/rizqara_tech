const mongoose=require('mongoose');
const {requireAdmin,rateLimit}=require('./security');
const schema=new mongoose.Schema({eventId:{type:String,unique:true},visitor:String,path:String,action:String,createdAt:{type:Date,default:Date.now,expires:7776000}});
schema.index({createdAt:1,path:1});
const actions=new Set(['estimate_completed','estimate_shared','booking_clicked','inquiry_sent','academy_sample_click']);
const View=mongoose.model('PageView',schema);
module.exports=function(router){
 router.post('/analytics/view',rateLimit('pageview',120),async(req,res,next)=>{
  const {eventId,visitor,path,consent,action}=req.body||{};
  if(consent!==true||(action!==undefined&&!actions.has(action))||![eventId,visitor].every(v=>typeof v==='string'&&/^[a-f0-9-]{36}$/i.test(v))||typeof path!=='string'||path.length>300||!/^\/(?:[a-z0-9_/-]*)$/i.test(path)||/^\/(admin|api)(\/|$)/i.test(path))return res.status(400).json({error:'Invalid page view'});
  if(/bot|crawler|spider|headless/i.test(req.get('user-agent')||''))return res.sendStatus(204);
  try{await View.updateOne({eventId},{$setOnInsert:{visitor,path,...(action ? {action} : {}),createdAt:new Date()}},{upsert:true});res.sendStatus(204);}catch(e){if(e.code===11000)return res.sendStatus(204);next(e);}
 });
 router.get('/analytics/summary',requireAdmin,async(req,res,next)=>{
  const days=Number(req.query.days||7);if(![7,30,90].includes(days))return res.status(400).json({error:'Invalid range'});
  const now=new Date();const date=new Date(now.getTime()+6*3600000);const start=new Date(Date.UTC(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate())-6*3600000-(days-1)*86400000);
  try{const [result]=await View.aggregate([{$match:{createdAt:{$gte:start,$lte:now}}},{$facet:{actions:[{$match:{action:{$in:[...actions]}}},{$group:{_id:'$action',count:{$sum:1}}}],totals:[{$match:{action:{$exists:false}}},{$group:{_id:null,views:{$sum:1},visitors:{$addToSet:'$visitor'}}},{$project:{_id:0,views:1,visitors:{$size:'$visitors'}}}],daily:[{$match:{action:{$exists:false}}},{$group:{_id:{$dateToString:{date:'$createdAt',format:'%Y-%m-%d',timezone:'Asia/Dhaka'}},views:{$sum:1}}},{$sort:{_id:1}}],pages:[{$match:{action:{$exists:false}}},{$group:{_id:'$path',views:{$sum:1}}},{$sort:{views:-1}},{$limit:10}]}}]);res.set('Cache-Control','no-store').json({days,totals:result.totals[0]||{views:0,visitors:0},daily:result.daily,pages:result.pages,actions:result.actions});}catch(e){next(e);}
 });
};
