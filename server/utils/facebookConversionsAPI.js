const bizSdk = require('facebook-nodejs-business-sdk');

const Content = bizSdk.Content;
const CustomData = bizSdk.CustomData;
const EventRequest = bizSdk.EventRequest;
const UserData = bizSdk.UserData;
const ServerEvent = bizSdk.ServerEvent;

// Your credentials
const access_token = process.env.FACEBOOK_ACCESS_TOKEN || 'MANUAL_TOKEN_HERE';
const pixel_id = '1745370408995219';
const api = bizSdk.FacebookAdsApi.init(access_token);

const sendPurchaseEvent = async (orderData) => {
  try {
    const userData = (new UserData())
      .setEmails([orderData.email])
      .setPhones([orderData.phone])
      .setFirstName(orderData.firstName)
      .setLastName(orderData.lastName)
      .setCountryCode('MA');

    const customData = (new CustomData())
      .setCurrency('MAD')
      .setValue(orderData.totalAmount)
      .setOrderId(orderData.orderId);

    const serverEvent = (new ServerEvent())
      .setEventName('Purchase')
      .setEventTime(Math.floor(Date.now() / 1000))
      .setUserData(userData)
      .setCustomData(customData)
      .setActionSource('website');

    const eventRequest = (new EventRequest(access_token, pixel_id))
      .setEvents([serverEvent]);

    const response = await eventRequest.execute();
    console.log('✅ Facebook Conversions API - Purchase sent:', response);
    return response;

  } catch (error) {
    console.error('❌ Facebook Conversions API error:', error);
    throw error;
  }
};

module.exports = { sendPurchaseEvent };