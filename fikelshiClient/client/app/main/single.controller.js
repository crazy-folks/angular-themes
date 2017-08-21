'use strict';

(function() {

class SingleProductController {
    constructor($stateParams, Product, Review, socket, SingleProduct, Auth, Toast, LoginModal,$mdDialog, appConfig) {
        var vm = this;
        vm.reviewSettings = appConfig.reviewSettings || [];
        vm.$mdDialog = $mdDialog;
        vm.currentUser = Auth.getCurrentUser();
        vm.LoginModal = LoginModal
        vm.Auth = Auth
        vm.Toast = Toast
        vm.Review = Review

        var id = $stateParams.id;
        if (localStorage !== null && JSON !== null && id !== null) {
            localStorage.productId = id;
        }
        vm.productId = localStorage !== null ? localStorage.productId : null;

        SingleProduct.$promise.then(function(res) {
            vm.product = res;
            if(!appConfig.reviewSettings.enabled){ // If the settings says not to enable reviews
                return;
            }
            vm.q = {pid:SingleProduct._id}
            vm.getReviews()
            
        })
        vm.i=0;
        vm.changeIndex =function(i){
            vm.i=i;
        };
    }
    getReviews(){
        var vm = this
        vm.Review.my.query(vm.q, function(r){
            vm.reviews = r;
            vm.publishtRatings(vm.reviews)
        })
    }
    publishtRatings(r){
        var vm = this
        var reviewCount = 0
                var rating = {r5: 0, r4: 0, r3:0, r2:0, r1:0, count:0,total:0,avg:0}
                r.forEach(function(i) {
                    if(i.message) reviewCount++
                    if(i.rating) rating.count++
                    if(i.rating) rating.total = rating.total+i.rating
                    if(i.rating == 5) rating.r5++
                    if(i.rating == 4) rating.r4++
                    if(i.rating == 3) rating.r3++
                    if(i.rating == 2) rating.r2++
                    if(i.rating == 1) rating.r1++
                }, this);
                vm.reviewCount = reviewCount
                rating.avg = Math.round(rating.total/rating.count * 10)/10
                vm.rating = rating
    }
    deleteReview(review) {
        var vm = this
        var confirm = this.$mdDialog.confirm()
        .title('Are you sure to delete your review?')
        .textContent('This is unrecoverable')
        .ariaLabel('Confirm delete review')
        .ok('Please do it!')
        .cancel('No. keep')

        this.$mdDialog.show(confirm).then(function() {
            vm.Review.delete({id:review._id}, function(){
                vm.getReviews()
            }, function(err){
                vm.Toast.show({type:'error', text: 'Error while saving your review: '+err.data})
            });
        })
    }
    myReview(review) {
        if(this.Auth.getCurrentUser().email == review.email)
            return true
    }

    reviewForm() {
        var vm = this
        if(!vm.Auth.getCurrentUser().name){
            vm.LoginModal.show('single-product', true) // Reload the route, else it won't show the wishlist status of the product
            return
        }
        vm.$mdDialog.show({
          templateUrl: 'app/main/review-form.html',
          controller: NewReviewController
        }).then(function(data) {
            vm.getReviews()
            if(vm.reviewSettings.moderate)
                vm.Toast.show({type:'success', text: 'Your review is under moderation. Will be visible to public after approval.'})
        });
        function NewReviewController($scope, $mdDialog, Review, Toast) {
            var user = vm.Auth.getCurrentUser()
            $scope.hide = function() {
                $mdDialog.hide();
            };
            $scope.cancel = function() {
                $mdDialog.cancel();
            };
            $scope.save = function(data) {
            if(!data){
                $scope.message = 'Please rate the item from a scale of 1-5'
                return
            }
            data.pid = vm.product._id;
            data.pname = vm.product.name;
            data.pslug = vm.product.slug;
            data.email = user.email;
            data.reviewer = user.name;
            Review.save(data, function(){
            },function(err){
                Toast.show({type:'error', text: 'Error while saving your review: '+err.data})
            })
            $mdDialog.hide(data);
            };
        }
    NewReviewController.$inject = ['$scope','$mdDialog', 'Review', 'Toast'];
    }
}

angular.module('materialShopApp')
  .controller('SingleProductController', SingleProductController);

})();


