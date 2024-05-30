"Inside this module are some functions that helps you manipulate time (don't take it seriously)."

def setTimeout(timeout: int or float = 0):
  "This is a decorator factory. This delays any function (if run) made with this."
  def decorator(func):
    from threading import Timer
    from functools import wraps
    @wraps(func)
    def wrapper(*args, **kwargs):
      timer = Timer(float(timeout), func, args=args, kwargs=kwargs)
      timer.start()
      return timer
    return wrapper
  return decorator
  
def setInterval(interval: int or float = 0, stop: int or float = float("inf")):
  "This is a decorator factory. This runs any function (if run) into a loop with the interval in seconds."
  def decorator(func):
    import time
    from functools import wraps
    @wraps(func)
    def wrapper(*args, **kwargs):
      otime = time.time()
      @setTimeout(interval)
      def timer():
        result = func(*args, **kwargs)
        if time.time()-otime < stop: timer()
      timer()
    return wrapper
  return decorator