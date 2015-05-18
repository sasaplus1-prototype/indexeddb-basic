(function(){

  'use strict';

  var db = indexedDB.open('database', 1),
      conn;

  db.onupgradeneeded = function() {
    var connection = event.target.result,
        oldVersion = event.oldVersion,
        store;

    if (oldVersion < 1) {
      store = connection.createObjectStore('store', {
        autoIncrement: true,
        keyPath: 'id'
      });
      store.createIndex('timestamp', 'timestamp', {
        unique: false,
        multiEntry: false
      });
    }
  };

  db.onsuccess = function(event) {
    console.log('open db');
    conn = event.target.result;
  };

  db.onerror = function(err) {
    console.error('failed');
    console.error(err);
  };

  //----------------------------------------------------------------------------

  drop.addEventListener('click', function(event) {
    var request = indexedDB.deleteDatabase('database');

    request.onsuccess = function(event) {
      console.log('delete db');
    };

    request.onerror = function(err) {
      console.error('failed');
      console.error(err);
    };
  }, false);

  clear.addEventListener('click', function(event) {
    var transaction = conn.transaction(['store'], 'readwrite'),
        store = transaction.objectStore('store'),
        request = store.clear();

    request.onsuccess = function(event) {
      console.log('clear');
      console.log(event);
    };

    request.onerror = function(err) {
      console.error('failed');
      console.error(err);
    };
  }, false);

  put.addEventListener('click', function(event) {
    var transaction = conn.transaction(['store'], 'readwrite'),
        store = transaction.objectStore('store'),
        request = store.put({
          data1: data1.value,
          data2: data2.value,
          timestamp: Date.now()
        });

    request.onsuccess = function(event) {
      console.log('put');
      console.log(event.target.result);
    };

    request.onerror = function(err) {
      console.error('failed');
      console.error(err);
    };
  }, false);

  get.addEventListener('click', function(event) {
    var transaction = conn.transaction(['store'], 'readonly'),
        store = transaction.objectStore('store'),
        request = store.get(parseInt(key.value, 10));

    request.onsuccess = function(event) {
      console.log('get');
      console.log(event.target.result);
    };

    request.onerror = function(err) {
      console.error('failed');
      console.error(err);
    };
  }, false);

  remove.addEventListener('click', function(event) {
    var transaction = conn.transaction(['store'], 'readwrite'),
        store = transaction.objectStore('store'),
        request = store.delete(parseInt(key.value, 10));

    request.onsuccess = function(event) {
      console.log('remove');
      console.log(event);
    };

    request.onerror = function(err) {
      console.error('failed');
      console.error(err);
    };
  }, false);

  cursor.addEventListener('click', function(event) {
    var transaction = conn.transaction(['store'], 'readwrite'),
        store = transaction.objectStore('store'),
        range = IDBKeyRange.only(parseInt(key.value, 10)),
        request = store.get(range);

    request.onsuccess = function(event) {
      console.log('cursor');
      console.log(event.target.result);
    };

    request.onerror = function(err) {
      console.error('failed');
      console.error(err);
    };
  }, false);

  range.addEventListener('click', function(event) {
    var transaction = conn.transaction(['store'], 'readwrite'),
        store = transaction.objectStore('store'),
        range = IDBKeyRange.bound(
          parseInt(lower.value, 10),
          parseInt(upper.value, 10)
        ),
        request = store.openCursor(range);

    request.onsuccess = function(event) {
      var cursor = event.target.result;

      if (cursor) {
        console.log('range');
        console.log(cursor.value);
        cursor.continue();
      } else {
        console.log('end of range');
      }
    };

    request.onerror = function(err) {
      console.error('failed');
      console.error(err);
    };
  }, false);

  timestamp.addEventListener('click', function(event) {
    var transaction = conn.transaction(['store'], 'readwrite'),
        store = transaction.objectStore('store'),
        range = IDBKeyRange.only(parseInt(time.value, 10)),
        request = store.index('timestamp').get(range);

    request.onsuccess = function(event) {
      console.log('timestamp');
      console.log(event.target.result);
    };

    request.onerror = function(err) {
      console.error('failed');
      console.error(err);
    };
  }, false);

}());
