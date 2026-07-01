import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:connectivity_plus/connectivity_plus.dart';
import '../core/scoring_engine.dart';
import '../models/review.dart';
import 'storage_service.dart';

class SyncService {
  SyncService._();
  static final instance = SyncService._();

  void startBackgroundSync() {
    Connectivity().onConnectivityChanged.listen((_) => syncPending());
    syncPending();
  }

  Future<void> syncPending() async {
    try {
      final db = FirebaseFirestore.instance;
      final configDoc = await db.collection('score_config').doc('default').get();
      if (configDoc.exists) {
        final categories = (configDoc.data()!['categories'] as List)
            .map((e) => CategoryWeight.fromJson(e as Map<String, dynamic>))
            .toList();
        await StorageService.instance.saveScoreConfig(categories);
      }
    } catch (_) {}

    final reviews = StorageService.instance.getReviews();
    for (final review in reviews) {
      if (review.syncStatus == 'pending' || review.syncStatus == 'failed') {
        await syncReview(review);
      }
    }
  }

  Future<Review> syncReview(Review review) async {
    final pending = review.copyWith(syncStatus: 'pending');
    await StorageService.instance.upsertReview(pending);

    try {
      final collection = review.isDraft ? 'draft_reviews' : 'reviews';
      await FirebaseFirestore.instance.collection(collection).doc(review.id).set(
            review.toFirestore(),
            SetOptions(merge: true),
          );
      final submitted = review.copyWith(
        syncStatus: 'submitted',
        isDraft: false,
      );
      await StorageService.instance.upsertReview(submitted);
      await FirebaseFirestore.instance.collection('sync_status_logs').add({
        'reviewId': review.id,
        'status': 'success',
        'timestamp': FieldValue.serverTimestamp(),
      });
      return submitted;
    } catch (e) {
      final failed = review.copyWith(syncStatus: 'failed');
      await StorageService.instance.upsertReview(failed);
      return failed;
    }
  }

  Future<Review> submitReview(Review review) async {
    final recalculated = review.recalculate(StorageService.instance.scoreConfig);
    final toSubmit = recalculated.copyWith(
      isDraft: false,
      syncStatus: 'pending',
    );
    return syncReview(toSubmit);
  }
}
