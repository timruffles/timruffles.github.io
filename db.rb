require "uri"
require "pg"
def get_db
  u = URI.parse(ENV["DATABASE_URL"])
  conn = ["host","port","user","password"].inject({}) {|h,k| h[k] = u.send(k) ; h}
  conn["dbname"] = u.path[1..-1]
  PG.connect(conn)
end
