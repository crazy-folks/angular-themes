module.exports = {
	'port': process.env.PORT || 8080,

   // Dev/ Test database connection. 
	//'database': 'mongodb://Infoshare01:Kazumer01@ds031335-a0.mongolab.com:31335,ds031335-a1.mongolab.com:31335/infocluster?replicaSet=rs-ds031335',
    'database': 'mongodb://localhost:27017',
	//************************************************************************** 
	// Production database connection. Do not Uncomment unless its a Production Deployment

	// 'database': 'mongodb://InfoProd:megamix99@ds041105-a0.mongolab.com:41105,ds041105-a1.mongolab.com:41105/infocluster?replicaSet=rs-ds041105',
	
	//**************************************************************************

	'secret': 'ilovescotchscotchyscotchscotch'
};