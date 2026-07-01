import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../core/scoring_engine.dart';
import '../models/review.dart';

class StorageService {
  StorageService._();
  static final instance = StorageService._();

  static const _reviewsKey = 'coursegrade_reviews';
  static const _configKey = 'coursegrade_score_config';
  static const _identityKey = 'coursegrade_identity';
  static const _seededKey = 'coursegrade_seeded';

  late SharedPreferences _prefs;
  List<CategoryWeight> scoreConfig = List.from(defaultScoreConfig);

  Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();
    final configJson = _prefs.getString(_configKey);
    if (configJson != null) {
      final list = (jsonDecode(configJson) as List)
          .map((e) => CategoryWeight.fromJson(e as Map<String, dynamic>))
          .toList();
      if (list.isNotEmpty) scoreConfig = list;
    }
  }

  List<Review> getReviews() {
    final raw = _prefs.getString(_reviewsKey);
    if (raw == null) return [];
    return (jsonDecode(raw) as List)
        .map((e) => Review.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<void> saveReviews(List<Review> reviews) async {
    await _prefs.setString(
      _reviewsKey,
      jsonEncode(reviews.map((r) => r.toJson()).toList()),
    );
  }

  Future<Review> upsertReview(Review review) async {
    final reviews = getReviews();
    final idx = reviews.indexWhere((r) => r.id == review.id);
    final updated = review.copyWith(updatedAt: DateTime.now().toIso8601String());
    if (idx >= 0) {
      reviews[idx] = updated;
    } else {
      reviews.add(updated);
    }
    await saveReviews(reviews);
    return updated;
  }

  Review? getActiveDraft() => getReviews().where((r) => r.isDraft).firstOrNull;

  Future<void> saveScoreConfig(List<CategoryWeight> config) async {
    scoreConfig = config;
    await _prefs.setString(
      _configKey,
      jsonEncode(config.map((c) => c.toJson()).toList()),
    );
  }

  Future<void> seedIfNeeded() async {
    if (_prefs.getBool(_seededKey) == true) return;
    final now = DateTime.now().toIso8601String();
    final submitted = Review.seedPebble(now);
    final draft = Review.seedAugustaDraft(now);
    await saveReviews([submitted, draft]);
    await _prefs.setBool(_seededKey, true);
  }
}

extension _FirstOrNull<E> on Iterable<E> {
  E? get firstOrNull => isEmpty ? null : first;
}
