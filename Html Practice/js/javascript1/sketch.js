Notification.requestPermission().then(
  function(permission) {
    Object.defineProperty(Notification, "permission", { writable: true });
    Object.defineProperty(Notification, "maxActions", { writable: true });
    Notification.maxActions = 10;
    Notification.permission = permission;
    Object.defineProperty(Notification, "permission", { writable: false });
    Object.defineProperty(Notification, "maxActions", { writable: false });
    sessionStorage.setItem('notification', permission);
    if(permission === "granted") {
      alert("Permission granted! 😃")
      let test = new Notification('Hello', { body: 'Hello, world!', icon: 'url to an .ico image' });
      alert(test)
    }
    else {
      alert("Permission denied! 😑");
    }
  }
);

navigator.getBattery().then(function(battery) {
  sessionStorage.batteryLvL = battery.level * 100;
  sessionStorage.batteryEmpty = battery.dischargingTime;
  sessionStorage.batteryFull = battery.chargingTime;
  sessionStorage.batteryCharge = battery.charging;
});

