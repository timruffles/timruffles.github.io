require "pg"
db = PG.connect(ENV["DATABASE_URL"])
loop do
  puts "Add link url:"
  url = gets
  puts "Add link slug:"
  slug = gets
  puts "Ok to expose (y/n): /l/#{slug}, pointing at #{url}"
  yes = gets
  if yes.downcase = "y"
    db.exec_params("INSERT INTO links (name,url) VALUES ('$1','$2')",[slug,url])
    puts "Done!\n"
  else
    puts "Ignoring\n"
  end
end
