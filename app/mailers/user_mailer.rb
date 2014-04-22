class UserMailer < ActionMailer::Base
  
  default from: 'reaper@wambl.com'

  def new_user user

  	@user = user
  	
  	mail to: user.email, subject: 'Sign Up Confirmation'

  end

end