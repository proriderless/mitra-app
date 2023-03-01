const fileResponse = require('./worker-server.js')

try {
  if(!self.window){
    window=self;

    self.addEventListener('install', () => {
      self.skipWaiting()
    })
    
    self.addEventListener('fetch', event => {
      const res = fileResponse(event)
      if (res) event.respondWith(res)
    })
    
    self.addEventListener('activate', () => {
      self.clients.claim()
    })
  }
} catch(e) { // do nothing 
  console.log('throw something if not workign')
}

