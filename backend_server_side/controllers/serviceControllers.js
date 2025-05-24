const serviceModel = require('../models/serviceModel')


const createService = async (req, res) => {
  try{
    // //console.log('post api hitting');
    const service = req.body;
    console.log(req.body)

    const createdService = await serviceModel.create(service);
    res.status(200).json(createdService);
  }
  catch(e){
    res.status(500).json({ message: 'Internal server error: ', error:e.message });
  }
}


const getServices = async (req, res) => {
  try{
    const services = await serviceModel.find();
    res.status(200).json(services);
  }
  catch(e){
    res.status(500).json({ message: 'Internal server error: ', error:e.message });
  }
  
}


const getServiceById = async (req, res) => {
  try{
    const {service_id} = req.params;
    // //console.log(id);
    const service = await serviceModel.findOne( {_id: service_id} );
    res.status(200).json(service);
  }
  catch(e){
    res.status(500).json({ message: 'Internal server error: ', error:e.message });
  }
}


const getServicePrice = async (req, res) => {
  try{
    const { service_id } = req.params;
    const service = await serviceModel.findOne( {_id: service_id} );
    res.status(200).json(service.service_price);
  }
  catch(e){
    res.status(500).json({ message: 'Internal server error: ', error:e.message });
  }
}


module.exports = { 
  createService,
  getServices,
  getServicePrice,
  getServiceById
};
