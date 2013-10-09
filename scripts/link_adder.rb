require_relative "../db"
db = get_db
loop do
  puts "Add link url:"
  url = gets.chomp
  puts "Add link slug:"
  slug = gets.chomp
  puts "Ok to expose (y/n): /l/#{slug}, pointing at #{url}"
  yes = gets.chomp
  if yes.downcase == "y"
    db.exec_params("INSERT INTO links (name,url) VALUES ($1,$2)",[slug,url])
    puts "Done!\n"
  else
    puts "Ignoring\n"
  end
end
