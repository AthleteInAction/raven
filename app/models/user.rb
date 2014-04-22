class UserValidator < ActiveModel::Validator
  
  def validate user

  	user.password_confirmation = user.password

  end

end
class User < ActiveRecord::Base

	validates_with UserValidator
	
	has_many :links

	has_secure_password
	attr_accessible :name,:email,:last_login,:password,:password_confirmation,:confirmed
	validates_presence_of :email
	validates_uniqueness_of :email

end