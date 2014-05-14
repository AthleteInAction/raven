Raven::Application.routes.draw do

  root :to => 'splash#index'

  get 'signup', to: 'users#new', as: 'signup'
  get 'login', to: 'sessions#new', as: 'login'
  get 'logout', to: 'sessions#destroy', as: 'logout'

  get 'app',to: 'app#index'

  # Events
  # ////////////////////////////////////////////////////////////////
  # ////////////////////////////////////////////////////////////////
  resources :events
  namespace :api do
    namespace :v1 do
      
      resources :events do
        resources :invitations
        resources :comments
        resources :expenses
        get 'users',to: 'events#users'
      end

      get 'instagram/:hashtag',to: 'instagram#index'

      resources :links
      resources :invitations
      resources :users do

        resources :contacts

      end
      resources :contacts

    end
  end
  # ////////////////////////////////////////////////////////////////
  # ////////////////////////////////////////////////////////////////

  # Users
  # ////////////////////////////////////////////////////////////////
  # ////////////////////////////////////////////////////////////////
  resources :users
  # ////////////////////////////////////////////////////////////////
  # ////////////////////////////////////////////////////////////////

  # Sessions
  # ////////////////////////////////////////////////////////////////
  # ////////////////////////////////////////////////////////////////
  resources :sessions
  # ////////////////////////////////////////////////////////////////
  # ////////////////////////////////////////////////////////////////

  # AngularJS Templates
  # ////////////////////////////////////////////////////////////////
  # ////////////////////////////////////////////////////////////////
  get "angularjs/templates/:template" => 'templates#load_template'
  # ////////////////////////////////////////////////////////////////
  # ////////////////////////////////////////////////////////////////

end